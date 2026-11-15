#define LGFX_USE_V1
#include <LovyanGFX.hpp>
#include <lgfx_user/LGFX_ESP32S3_RGB_ESP32-8048S043.h>
#include <ArduinoJson.h>

static LGFX lcd;

// Telemetry State
float g_o2_kalman = 21.0f;
float g_o2_raw = 21.0f;
float g_co_ppm = 22.0f;
float g_co_raw = 21.5f;
float g_k_gain = 0.167f;
float g_chip_temp = 38.5f;
String g_status = "NOMINAL";
bool g_is_critical = false;
unsigned long g_last_packet_ms = 0;
bool g_screen_needs_static_draw = true;

// Colors
#define CLR_BG       lcd.color565(11, 15, 25)
#define CLR_CARD_BG  lcd.color565(20, 25, 38)
#define CLR_BORDER   lcd.color565(42, 52, 74)
#define CLR_GREEN    lcd.color565(118, 185, 0)
#define CLR_CYAN     lcd.color565(0, 210, 255)
#define CLR_ORANGE   lcd.color565(255, 165, 0)
#define CLR_RED      lcd.color565(229, 32, 32)
#define CLR_MUTED    lcd.color565(140, 150, 175)

void drawStaticLayout() {
    lcd.fillScreen(CLR_BG);

    // --- Header ---
    lcd.fillRect(0, 0, 800, 50, lcd.color565(15, 20, 32));
    lcd.drawFastHLine(0, 50, 800, CLR_BORDER);

    lcd.setTextColor(CLR_GREEN);
    lcd.setTextSize(3);
    lcd.drawString("STELLARAPP", 20, 12);

    lcd.setTextColor(TFT_WHITE);
    lcd.setTextSize(2);
    lcd.drawString("ASTRONAUT FLIGHT DECK // ECLSS HUD", 215, 18);

    // --- 3 Main Cards ---
    // Card 1: Oxígeno
    lcd.fillRoundRect(20, 65, 240, 260, 8, CLR_CARD_BG);
    lcd.drawRoundRect(20, 65, 240, 260, 8, CLR_BORDER);
    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("OXIGENO AMBIENTAL", 35, 80);

    // Card 2: CO & Kalman
    lcd.fillRoundRect(280, 65, 240, 260, 8, CLR_CARD_BG);
    lcd.drawRoundRect(280, 65, 240, 260, 8, CLR_BORDER);
    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("FILTRO DE KALMAN (CO)", 295, 80);

    // Card 3: RP2040 Sonda
    lcd.fillRoundRect(540, 65, 240, 260, 8, CLR_CARD_BG);
    lcd.drawRoundRect(540, 65, 240, 260, 8, CLR_BORDER);
    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("SONDA RP2040", 555, 80);

    // Emergency Action Button
    lcd.fillRoundRect(20, 345, 760, 105, 10, CLR_CARD_BG);
    lcd.drawRoundRect(20, 345, 760, 105, 10, CLR_CYAN);
    lcd.setTextColor(TFT_WHITE);
    lcd.setTextSize(2);
    lcd.drawString("ACTIVAR PURGA INERTE N2 / PROTOCOLO EVACUACION", 80, 385);
}

void drawDynamicData() {
    uint16_t status_color = g_is_critical ? CLR_RED : CLR_GREEN;

    // Header Live Indicator
    lcd.fillRect(630, 14, 150, 25, lcd.color565(15, 20, 32));
    lcd.fillCircle(640, 26, 6, status_color);
    lcd.setTextColor(status_color);
    lcd.setTextSize(2);
    lcd.drawString(g_is_critical ? "CRITICO" : "EN LINEA", 655, 18);

    // --- Card 1: Oxígeno ---
    lcd.fillRect(30, 110, 220, 195, CLR_CARD_BG);
    lcd.setTextColor(g_is_critical ? CLR_RED : CLR_CYAN);
    lcd.setTextSize(5);
    char o2_str[16];
    snprintf(o2_str, sizeof(o2_str), "%.1f%%", g_o2_kalman);
    lcd.drawString(o2_str, 35, 120);

    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("Sensor Bruto:", 35, 185);
    lcd.setTextColor(TFT_WHITE);
    char o2_raw_str[16];
    snprintf(o2_raw_str, sizeof(o2_raw_str), "%.1f%%", g_o2_raw);
    lcd.drawString(o2_raw_str, 160, 185);

    // Oxygen Bar
    lcd.drawRect(35, 230, 205, 16, CLR_BORDER);
    int bar_w = (int)((g_o2_kalman / 35.0f) * 201.0f);
    if (bar_w > 201) bar_w = 201;
    if (bar_w < 0) bar_w = 0;
    lcd.fillRect(37, 232, bar_w, 12, g_is_critical ? CLR_RED : CLR_GREEN);

    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(1);
    lcd.drawString("18% (Sub-Nom)", 35, 255);
    lcd.drawString("21% Nom", 120, 255);
    lcd.drawString("30% Hiper", 185, 255);

    // --- Card 2: CO & Kalman ---
    lcd.fillRect(290, 110, 220, 195, CLR_CARD_BG);
    lcd.setTextColor(g_is_critical ? CLR_RED : CLR_GREEN);
    lcd.setTextSize(5);
    char co_str[16];
    snprintf(co_str, sizeof(co_str), "%.0f", g_co_ppm);
    lcd.drawString(co_str, 295, 120);
    lcd.setTextSize(2);
    lcd.drawString("ppm", 420, 145);

    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("Filtro Kalman:", 295, 185);
    lcd.drawString("Ganancia (K):", 295, 215);
    lcd.setTextColor(TFT_WHITE);
    lcd.drawString("Activo", 435, 185);
    char kg_str[16];
    snprintf(kg_str, sizeof(kg_str), "%.3f", g_k_gain);
    lcd.drawString(kg_str, 435, 215);

    lcd.setTextColor(g_is_critical ? CLR_RED : CLR_GREEN);
    lcd.setTextSize(2);
    lcd.drawString(g_is_critical ? "TOXICIDAD ALTA" : "ESTABLE (3.5s)", 295, 255);

    // --- Card 3: RP2040 Sonda ---
    lcd.fillRect(550, 110, 220, 195, CLR_CARD_BG);
    lcd.setTextColor(g_chip_temp >= 42.0f ? CLR_RED : CLR_CYAN);
    lcd.setTextSize(5);
    char temp_str[16];
    snprintf(temp_str, sizeof(temp_str), "%.1f", g_chip_temp);
    lcd.drawString(temp_str, 555, 120);
    lcd.setTextSize(2);
    lcd.drawString("oC", 695, 125);

    lcd.setTextColor(CLR_MUTED);
    lcd.setTextSize(2);
    lcd.drawString("Hardware:", 555, 185);
    lcd.setTextColor(TFT_WHITE);
    lcd.drawString("Pico W (COM6)", 555, 205);

    lcd.setTextColor(CLR_MUTED);
    lcd.drawString("Evacuacion:", 555, 235);
    lcd.setTextColor(g_is_critical ? CLR_RED : CLR_GREEN);
    lcd.drawString(g_is_critical ? "< 3 MIN" : "NOMINAL", 555, 255);

    // --- Bottom Button dynamic color ---
    if (g_is_critical) {
        lcd.fillRoundRect(20, 345, 760, 105, 10, CLR_RED);
        lcd.drawRoundRect(20, 345, 760, 105, 10, TFT_WHITE);
        lcd.setTextColor(TFT_WHITE);
        lcd.setTextSize(3);
        lcd.drawString("ALERTA CRITICA // INICIAR PURGA N2", 70, 380);
    } else {
        lcd.fillRoundRect(20, 345, 760, 105, 10, CLR_CARD_BG);
        lcd.drawRoundRect(20, 345, 760, 105, 10, CLR_CYAN);
        lcd.setTextColor(TFT_WHITE);
        lcd.setTextSize(2);
        lcd.drawString("ACTIVAR PURGA INERTE N2 / PROTOCOLO EVACUACION", 80, 385);
    }
}

void setup() {
    Serial.begin(115200);
    delay(300);

    // Hardware Backlight Pin GPIO 2 HIGH
    pinMode(2, OUTPUT);
    digitalWrite(2, HIGH);

    lcd.init();
    lcd.setRotation(0);
    lcd.setBrightness(255);
    digitalWrite(2, HIGH);

    drawStaticLayout();
    drawDynamicData();

    Serial.println("{\"ready\": true, \"screen\": \"STELLARAPP_HUD_V2\"}");
}

unsigned long g_last_render_ms = 0;

void loop() {
    digitalWrite(2, HIGH);

    // Read Serial Telemetry JSON lines
    while (Serial.available()) {
        String line = Serial.readStringUntil('\n');
        line.trim();
        if (line.startsWith("{") && line.endsWith("}")) {
            JsonDocument doc;
            DeserializationError err = deserializeJson(doc, line);
            if (!err) {
                if (doc.containsKey("o2_kalman")) g_o2_kalman = doc["o2_kalman"].as<float>();
                if (doc.containsKey("o2_raw")) g_o2_raw = doc["o2_raw"].as<float>();
                if (doc.containsKey("co_ppm")) g_co_ppm = doc["co_ppm"].as<float>();
                if (doc.containsKey("k_gain")) g_k_gain = doc["k_gain"].as<float>();
                if (doc.containsKey("chip_temp_c")) g_chip_temp = doc["chip_temp_c"].as<float>();
                if (doc.containsKey("status")) g_status = doc["status"].as<String>();

                g_is_critical = (g_status.indexOf("CRITICO") >= 0 || g_chip_temp >= 42.0f || g_o2_kalman >= 27.5f || g_co_ppm >= 70.0f);
                g_last_packet_ms = millis();
            }
        }
    }

    // Check Touch on Button
    int32_t touch_x, touch_y;
    if (lcd.getTouch(&touch_x, &touch_y)) {
        if (touch_y >= 340 && touch_y <= 460 && touch_x >= 20 && touch_x <= 780) {
            // Button pressed! Toggle emergency purge
            g_is_critical = !g_is_critical;
            Serial.printf("{\"touch\": \"purge_button\", \"x\": %d, \"y\": %d, \"critical\": %s}\n", touch_x, touch_y, g_is_critical ? "true" : "false");
            drawDynamicData();
            delay(350); // Debounce
        }
    }

    // Refresh UI every 500ms
    if (millis() - g_last_render_ms >= 500) {
        g_last_render_ms = millis();
        drawDynamicData();
    }

    delay(20);
}

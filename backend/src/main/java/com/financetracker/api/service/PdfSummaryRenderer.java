package com.financetracker.api.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.financetracker.api.dto.summary.CategoryTotalResponse;
import com.financetracker.api.dto.summary.MonthlyTotalResponse;
import com.financetracker.api.dto.summary.WalletSummaryResponse;

@Component
public class PdfSummaryRenderer {
    private static final Locale LOCALE = Locale.forLanguageTag("pt-BR");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy", LOCALE);
    private static final DateTimeFormatter GENERATED_AT = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm", LOCALE);
    private static final DateTimeFormatter MONTH = DateTimeFormatter.ofPattern("MMMM/yyyy", LOCALE);
    private static final ZoneId REPORT_ZONE = ZoneId.of("America/Sao_Paulo");

    public byte[] render(String walletName, LocalDate startDate, LocalDate endDate, WalletSummaryResponse summary)
            throws IOException {
        try (PDDocument document = new PDDocument();
                InputStream fontFile = new ClassPathResource("fonts/DuruSans-Regular.ttf").getInputStream()) {
            PDType0Font font = PDType0Font.load(document, fontFile);
            NumberFormat currency = NumberFormat.getCurrencyInstance(LOCALE);
            try (ReportCanvas canvas = new ReportCanvas(document, font)) {
                canvas.title("Relatório financeiro");
                canvas.paragraph("Carteira: " + walletName);
                canvas.paragraph("Período: " + DATE.format(startDate) + " a " + DATE.format(endDate));
                canvas.paragraph("Gerado em " + GENERATED_AT.format(ZonedDateTime.now(REPORT_ZONE))
                        + " (horário de Brasília)");

                canvas.section("Resumo do período");
                canvas.amountRow("Receitas", currency.format(summary.totalIncome()));
                canvas.amountRow("Despesas", currency.format(summary.totalExpense()));
                canvas.amountRow("Resultado do período", currency.format(summary.balance()));
                canvas.amountRow("Lançamentos", String.valueOf(summary.transactionCount()));

                if (summary.transactionCount() == 0) {
                    canvas.paragraph("Sem movimentações no período.");
                }

                canvas.section("Movimentação por categoria (receitas + despesas)");
                if (summary.byCategory().isEmpty()) {
                    canvas.paragraph("Sem categorias com lançamentos no período.");
                } else {
                    canvas.categoryHeader();
                    for (CategoryTotalResponse category : summary.byCategory()) {
                        canvas.categoryRow(category.categoryName(), currency.format(category.total()));
                    }
                }

                canvas.section("Totais por mês");
                if (summary.byMonth().isEmpty()) {
                    canvas.paragraph("Sem meses com lançamentos no período.");
                } else {
                    canvas.monthHeader();
                    for (MonthlyTotalResponse month : summary.byMonth()) {
                        canvas.monthRow(
                                YearMonth.parse(month.month()).format(MONTH),
                                currency.format(month.income()),
                                currency.format(month.expense()),
                                currency.format(month.income().subtract(month.expense())));
                    }
                }
            }
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.save(output);
            return output.toByteArray();
        }
    }

    private static final class ReportCanvas implements AutoCloseable {
        private static final float LEFT = 48;
        private static final float RIGHT = PDRectangle.A4.getWidth() - LEFT;
        private static final float BOTTOM = 66;
        private static final float LINE_HEIGHT = 15;

        private final PDDocument document;
        private final PDType0Font font;
        private PDPageContentStream stream;
        private float y;
        private int pageNumber;

        private ReportCanvas(PDDocument document, PDType0Font font) throws IOException {
            this.document = document;
            this.font = font;
            newPage();
        }

        private void title(String value) throws IOException {
            ensureSpace(40);
            draw(value, LEFT, y, 19, new Color(23, 49, 95));
            y -= 37;
        }

        private void section(String value) throws IOException {
            ensureSpace(45);
            y -= 16;
            draw(value, LEFT, y, 12, new Color(23, 49, 95));
            y -= 12;
            rule();
            y -= 17;
        }

        private void paragraph(String value) throws IOException {
            List<String> lines = wrap(value, RIGHT - LEFT, 10);
            ensureSpace(lines.size() * LINE_HEIGHT + 6);
            for (String line : lines) {
                draw(line, LEFT, y, 10, Color.DARK_GRAY);
                y -= LINE_HEIGHT;
            }
            y -= 5;
        }

        private void amountRow(String label, String amount) throws IOException {
            List<String> lines = wrap(label, 320, 10);
            float height = Math.max(25, lines.size() * LINE_HEIGHT + 8);
            ensureSpace(height);
            float rowTop = y;
            for (String line : lines) {
                draw(line, LEFT, y, 10, Color.BLACK);
                y -= LINE_HEIGHT;
            }
            drawRight(amount, RIGHT, rowTop, 10);
            y = rowTop - height;
            rule();
        }

        private void categoryHeader() throws IOException {
            ensureSpace(30);
            draw("Categoria", LEFT, y, 9, Color.DARK_GRAY);
            drawRight("Total", RIGHT, y, 9);
            y -= 22;
            rule();
        }

        private void categoryRow(String label, String amount) throws IOException {
            float height = Math.max(25, wrap(label, 320, 10).size() * LINE_HEIGHT + 8);
            if (y - height < BOTTOM) {
                newPage();
                draw("Movimentação por categoria (continuação)", LEFT, y, 11, new Color(23, 49, 95));
                y -= 30;
                categoryHeader();
            }
            amountRow(label, amount);
        }

        private void monthHeader() throws IOException {
            ensureSpace(30);
            draw("Mês", LEFT, y, 9, Color.DARK_GRAY);
            drawRight("Receitas", 280, y, 9);
            drawRight("Despesas", 405, y, 9);
            drawRight("Resultado", RIGHT, y, 9);
            y -= 22;
            rule();
        }

        private void monthRow(String month, String income, String expense, String result) throws IOException {
            if (y - 28 < BOTTOM) {
                newPage();
                draw("Totais por mês (continuação)", LEFT, y, 11, new Color(23, 49, 95));
                y -= 30;
                monthHeader();
            }
            draw(month, LEFT, y, 9, Color.BLACK);
            drawRight(income, 280, y, 9);
            drawRight(expense, 405, y, 9);
            drawRight(result, RIGHT, y, 9);
            y -= 27;
            rule();
        }

        private void ensureSpace(float needed) throws IOException {
            if (y - needed < BOTTOM) {
                newPage();
            }
        }

        private void newPage() throws IOException {
            if (stream != null) {
                finishPage();
            }
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            stream = new PDPageContentStream(document, page);
            pageNumber++;
            y = PDRectangle.A4.getHeight() - 50;
            if (pageNumber > 1) {
                draw("Relatório financeiro · continuação", LEFT, y, 10, Color.DARK_GRAY);
                y -= 35;
            }
        }

        private void finishPage() throws IOException {
            draw("Finance Tracker", LEFT, 36, 8, Color.GRAY);
            drawRight("Página " + pageNumber, RIGHT, 36, 8);
            stream.close();
        }

        private void rule() throws IOException {
            stream.setStrokingColor(new Color(215, 220, 229));
            stream.setLineWidth(0.5f);
            stream.moveTo(LEFT, y - 5);
            stream.lineTo(RIGHT, y - 5);
            stream.stroke();
        }

        private void drawRight(String value, float right, float baseline, int fontSize) throws IOException {
            String safe = safe(value);
            float width = font.getStringWidth(safe) / 1000 * fontSize;
            draw(safe, right - width, baseline, fontSize, Color.BLACK);
        }

        private void draw(String value, float x, float baseline, int fontSize, Color color) throws IOException {
            stream.beginText();
            stream.setFont(font, fontSize);
            stream.setNonStrokingColor(color);
            stream.newLineAtOffset(x, baseline);
            stream.showText(safe(value));
            stream.endText();
        }

        private List<String> wrap(String value, float maxWidth, int fontSize) throws IOException {
            String safe = safe(value);
            List<String> lines = new ArrayList<>();
            StringBuilder line = new StringBuilder();
            for (int offset = 0; offset < safe.length();) {
                int codePoint = safe.codePointAt(offset);
                String next = new String(Character.toChars(codePoint));
                String candidate = line + next;
                if (!line.isEmpty() && font.getStringWidth(candidate) / 1000 * fontSize > maxWidth) {
                    lines.add(line.toString().trim());
                    line.setLength(0);
                    if (Character.isWhitespace(codePoint)) {
                        offset += Character.charCount(codePoint);
                        continue;
                    }
                }
                line.append(next);
                offset += Character.charCount(codePoint);
            }
            if (!line.isEmpty() || lines.isEmpty()) {
                lines.add(line.toString().trim());
            }
            return lines;
        }

        private String safe(String value) throws IOException {
            StringBuilder result = new StringBuilder();
            for (int offset = 0; offset < value.length();) {
                int codePoint = value.codePointAt(offset);
                String glyph = Character.isISOControl(codePoint) ? " " : new String(Character.toChars(codePoint));
                try {
                    font.getStringWidth(glyph);
                    result.append(glyph);
                } catch (IllegalArgumentException exception) {
                    result.append('?');
                }
                offset += Character.charCount(codePoint);
            }
            return result.toString();
        }

        @Override
        public void close() throws IOException {
            if (stream != null) {
                finishPage();
                stream = null;
            }
        }
    }
}

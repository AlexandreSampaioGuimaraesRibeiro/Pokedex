package com.pokedex.config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Lê os comandos INSERT de um script SQL e devolve, para cada tabela,
 * a lista de linhas (nome da coluna -> valor em texto).
 */
public final class SqlInsertParser {

    private static final Pattern INSERT = Pattern.compile(
        "INSERT\\s+INTO\\s+`?(\\w+)`?\\s*\\(([^)]*)\\)\\s*VALUES\\s*(.*?);",
        Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    private SqlInsertParser() {}

    public static Map<String, List<Map<String, String>>> parse(String sql) {
        Map<String, List<Map<String, String>>> tables = new LinkedHashMap<>();
        Matcher m = INSERT.matcher(sql);
        while (m.find()) {
            List<String> columns = new ArrayList<>();
            for (String c : m.group(2).split(",")) {
                columns.add(c.replace("`", "").trim());
            }
            List<Map<String, String>> rows = tables.computeIfAbsent(m.group(1), k -> new ArrayList<>());
            for (List<String> values : readTuples(m.group(3))) {
                Map<String, String> row = new LinkedHashMap<>();
                for (int i = 0; i < columns.size(); i++) {
                    row.put(columns.get(i), values.get(i));
                }
                rows.add(row);
            }
        }
        return tables;
    }

    // Percorre "(1, 'A'), (2, 'B''s')" respeitando aspas simples e '' escapado.
    private static List<List<String>> readTuples(String values) {
        List<List<String>> tuples = new ArrayList<>();
        List<String> current = null;
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < values.length(); i++) {
            char c = values.charAt(i);
            if (inQuotes) {
                if (c == '\'') {
                    if (i + 1 < values.length() && values.charAt(i + 1) == '\'') {
                        field.append('\'');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field.append(c);
                }
            } else if (c == '\'') {
                inQuotes = true;
            } else if (c == '(') {
                current = new ArrayList<>();
                field.setLength(0);
            } else if (c == ',' && current != null) {
                current.add(field.toString().trim());
                field.setLength(0);
            } else if (c == ')' && current != null) {
                current.add(field.toString().trim());
                tuples.add(current);
                current = null;
                field.setLength(0);
            } else if (current != null) {
                field.append(c);
            }
        }
        return tuples;
    }
}

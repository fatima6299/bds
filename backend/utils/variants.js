/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Helpers for parsing comma-separated product variant lists (sizes/colors)
 */

function parseVariantList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

module.exports = { parseVariantList };

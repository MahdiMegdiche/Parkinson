export function val(v) {
  return v && v.__getValue ? v.__getValue() : v || 0;
}
//# sourceMappingURL=val.js.map
export default (string) => string.replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");

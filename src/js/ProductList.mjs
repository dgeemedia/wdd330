export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;  // Adjusted path for public folder
  }

  async getData() {
    const res = await fetch(this.path);
    if (!res.ok) throw new Error("Bad Response");
    return res.json();
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.id === id);  // use lowercase 'id' unless your data is different
  }
}

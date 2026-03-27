import News from "../models/News";

class NewsService {
  async create(data: any) {
    return await News.create(data);
  }

  async getAll() {
    return await News.findAll({
      order: [["publishedAt", "DESC"]],
    });
  }

  async getLast10() {
    return await News.findAll({
      order: [["publishedAt", "DESC"]],
      limit: 10,
    });
  }

  async getById(id: number) {
    return await News.findByPk(id);
  }

  async update(id: number, data: any) {
    const news = await News.findByPk(id);
    if (!news) return null;

    await news.update(data);
    return news;
  }

  async delete(id: number) {
    const news = await News.findByPk(id);
    if (!news) return null;

    await news.destroy();
    return true;
  }
}

export default new NewsService();
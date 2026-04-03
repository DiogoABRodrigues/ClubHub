import News from "../models/News";
import cache from "../services/cache.service";
import { CacheKeys } from "../cache/keys";
import { pushService } from "./push.service";
import deviceService from "./device.service";
import AppSettings from "../models/AppSettings";

class NewsService {
async create(data: any) {
    const news = await News.create(data);

    await cache.del(CacheKeys.news.last10);

    // 📢 PUSH NOTIFICATION
    await this.notify(news);

    return news;
  }

  private async notify(news: any) {
        const settings = await AppSettings.findOne({ where: { key: "notifications_enabled" } });
    const rawValue = settings?.dataValues.value;

    const notificationsEnabled =
      rawValue === true ||
      rawValue === "true" ||
      rawValue === 1 ||
      rawValue === "1";

    if (!notificationsEnabled) return;
    const devices = await deviceService.getDevicesForNews();

    if (!devices.length) return;

    const title = "Foi publicada uma nova notícia!";
    const body = news.title || "Nova atualização disponível";

    const response = await pushService.sendToDevices(devices, {
      title,
      body,
    });

    await pushService.handleReceipts(response);
  }


  async getAll() {
    return await News.findAll({
      order: [["publishedAt", "DESC"]],
    });
  }

  async getLast10() {
    const key = CacheKeys.news.last10;

    const cached = await cache.get(key);
    if (cached) return cached;

    const news = await News.findAll({
      order: [["publishedAt", "DESC"]],
      limit: 10,
    });

    await cache.set(key, news, 60 * 5); // 5 min

    return news;
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

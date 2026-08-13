import { getIO } from "../config/socket";

class SocketService {
  emitMatchUpdate(match: any) {
    const io = getIO();
    io.emit("match:update", match);
  }

  emitDataUpdated() {
    const io = getIO();
    io.emit("data:updated");
  }

  emitScrapeJobUpdate(job: unknown) {
    getIO().emit("scrape:job", job);
  }

  emitMatchEvent(matchId: number, event: any) {
    const io = getIO();

    io.emit("match:event", {
      matchId,
      event,
    });
  }
}

export default new SocketService();

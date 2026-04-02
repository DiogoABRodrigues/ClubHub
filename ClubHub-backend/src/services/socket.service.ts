import { getIO } from "../config/socket";

class SocketService {
  emitMatchUpdate(match: any) {
    const io = getIO();
    console.log("Emitting match update for match ID:", match.id);
    io.emit("match:update", match);
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
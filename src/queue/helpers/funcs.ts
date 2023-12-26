import { MessageSchema } from "src/message/schemas/messageSchema";
import { SortBy } from "../../enums/sortBy";

export function sortTasksByReceipients(messages: MessageSchema[], sortBy = SortBy.Desc) {

    return sortBy === SortBy.Desc ? messages.slice().sort((a, b) => b.Recipients.length - a.Recipients.length) :
        messages.slice().sort((a, b) => a.Recipients.length - b.Recipients.length)

}

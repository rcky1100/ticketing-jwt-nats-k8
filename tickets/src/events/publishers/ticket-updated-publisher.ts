import { Publisher, Subjects, TicketUpdatedEvent } from "@rcky1983/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

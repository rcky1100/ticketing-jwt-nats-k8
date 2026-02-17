import { Publisher, Subjects, TicketCreatedEvent } from "@rcky1983/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

import { Publisher, OrderCreatedEvent, Subjects } from "@rcky1983/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

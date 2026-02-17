import { Subjects, Publisher, OrderCancelledEvent } from "@rcky1983/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

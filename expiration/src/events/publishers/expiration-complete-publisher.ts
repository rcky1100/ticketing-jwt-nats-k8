import { Subjects, Publisher, ExpirationCompleteEvent } from "@rcky1983/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

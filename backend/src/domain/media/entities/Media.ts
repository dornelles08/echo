import { Entity } from "@/core/entity";
import type { Segment } from "./Segment";
import type { Status } from "./Status";

export interface MediaProps {
  filename: string;
  url: string;
  type?: "video" | "audio";
  prompt?: string;
  transcription?: string;
  language: string;
  duration: number;
  segments?: Segment[];
  status?: Status;
  tags?: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Media extends Entity<MediaProps> {
  get filename() {
    return this.props.filename;
  }

  get url() {
    return this.props.url;
  }

  get type() {
    return this.props.type;
  }

  get prompt() {
    return this.props.prompt;
  }

  get transcription() {
    return this.props.transcription;
  }

  get status() {
    return this.props.status;
  }

  get tags() {
    return this.props.tags;
  }

  get language() {
    return this.props.language;
  }

  get duration() {
    return this.props.duration;
  }

  get segments() {
    return this.props.segments;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set transcription(transcription: string | undefined) {
    this.props.transcription = transcription;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: MediaProps, id?: string) {
    const media = new Media(
      {
        ...props,
        type: props.type ?? "audio",
        tags: props.tags ?? [],
        status: props.status ?? "pending",
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
    return media;
  }
}

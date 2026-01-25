interface MediaProps {
  id?: string;
  filename: string;
  url: string;
  type?: "video" | "audio";
  prompt?: string;
  transcription?: string;
  tags?: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Media {
  constructor(private props: MediaProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      type: props.type ?? "audio",
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

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

  get tags() {
    return this.props.tags;
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
    this.props.updatedAt = new Date();
  }
}

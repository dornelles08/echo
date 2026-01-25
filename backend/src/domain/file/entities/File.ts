interface FileProps {
  id?: string;
  name: string;
  url: string;
}

export class File {
  constructor(public readonly props: FileProps) {
    this.props.id = this.props.id ?? crypto.randomUUID();
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get url(): string {
    return this.props.url;
  }
}

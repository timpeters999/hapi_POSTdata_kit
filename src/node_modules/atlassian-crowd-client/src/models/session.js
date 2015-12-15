export default class Session {
  constructor(token, createdAt, expiresAt) {
    this.token = token;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
  }

  toCrowd() {
    return {
      'token': this.token,
      'created-date': this.createdAt.getTime(),
      'expiry-date': this.expiresAt.getTime()
    };
  }

  static fromCrowd({ token, 'created-date': createdAt, 'expiry-date': expiresAt }) { //eslint-disable-line no-dupe-args
    return new Session(token, new Date(createdAt), new Date(expiresAt));
  }
}

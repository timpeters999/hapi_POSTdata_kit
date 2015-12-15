export default class User {
  constructor(firstname, lastname, displayname, email, username, password = undefined, active = true) {
    this.firstname = firstname || '';
    this.lastname = lastname || '';
    this.displayname = displayname || '';
    this.email = email;
    this.username = username;
    this.password = password;
    this.active = active;
  }

  toCrowd() {
    let obj = {
      'name': this.username,
      'first-name': this.firstname,
      'last-name': this.lastname,
      'display-name': this.displayname,
      'email': this.email,
      'active': this.active
    };
    if (this.password) {
      obj.password = { value: this.password };
    }
    return obj;
  }

  static fromCrowd({ name, active, 'first-name': firstname, 'last-name': lastname, 'display-name': displayname, email }) { //eslint-disable-line no-dupe-args
    return new User(firstname, lastname, displayname, email, name, undefined, active);
  }
}

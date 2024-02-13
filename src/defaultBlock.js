export default class DefaultBlock {
  constructor(id, name, icon = 'welcome-learn-more') {
    this.name = id;
    this.icon = icon;
    this.description = '';
    this.attributes = {};

    this.enabled = true;

    this._settings = {
      title: name,
      description: '',
      icon: this.icon,
    };
  }

  setDescription(description) {
    this.description = description;
  }

  getAttributes() {
    return {};
  }

  edit() {
    throw new Error('edit must be overridden');
  }

  save() {
    return null;
  }

  get settings() {
    const data = Object.assign({}, this._settings);
    data.description = this.description;
    data.attributes = this.getAttributes();
    data.edit = this.edit;
    data.save = this.save;
    return data;
  }

}

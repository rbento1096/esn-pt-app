import { isEmpty, Resource } from 'idea-toolbox';

export class Organization extends Resource {
  /**
   * The organization ID.
   */
  organizationId: string;
  /**
   * The name of the organization.
   */
  name: string;
  /**
   * The URI for an image describing the organization
   */
  imageURI: string;
  /**
   * A description of the organization.
   */
  description: string;
  /**
   * The organization's website.
   */
  website: string;
  /**
   * The organization's contact email.
   */
  contactEmail: string;
  /**
   * A link to perform a contact action.
   */
  contactAction: string; // @todo check this

  load(x: any): void {
    super.load(x);
    this.organizationId = this.clean(x.organizationId, String);
    this.name = this.clean(x.name, String);
    this.imageURI = this.clean(x.imageURI, String);
    this.description = this.clean(x.description, String);
    this.website = this.clean(x.website, String);
    this.contactEmail = this.clean(x.contactEmail, String);
    this.contactAction = this.clean(x.contactAction, String);
  }
  safeLoad(newData: any, safeData: any): void {
    super.safeLoad(newData, safeData);
    this.organizationId = safeData.organizationId;
  }
  validate(): string[] {
    const e = super.validate();
    if (isEmpty(this.name)) e.push('name');
    if (this.website && isEmpty(this.website, 'url')) e.push('website');
    if (this.contactEmail && isEmpty(this.contactEmail, 'email')) e.push('contactEmail');
    return e;
  }
}

// @todo check this
export class OrganizationLinked extends Resource {
  organizationId: string;
  name: string;

  load(x: any): void {
    super.load(x);
    this.organizationId = this.clean(x.organizationId, String);
    this.name = this.clean(x.name, String);
  }
}

// @flow

export type StudentOrgAbridgedType = {
  campusName: string,
  categories: string[],
  hasCoverImage: boolean,
  hasUpcomingEvents: boolean,
  memberCount: number,
  name: string,
  newOrg: boolean,
  orgMember: boolean,
  photoType?: string,
  photoUri?: string,
  photoVersion: string,
  subdomain: string,
  uri: string,
}

export type StudentOrgInfoType = {
  campusName: string,
  categories: string[],
  contactName: string,
  description?: string,
  documentCount: number,
  facebook: string,
  forms: any[],
  hasCoverImage: boolean,
  hasEmailAddress: boolean,
  isMember: boolean,
  isOfficer: boolean,
  memberCount: number,
  name: string,
  photoType?: string,
  photoUri?: string,
  photoVersion: string,
  regularMeetingLocation?: string,
  regularMeetingTime?: string,
  subdomain: string,
  twitter: string,
  uri: string,
}

export type GroupingArgsType = {
  searching: boolean,
}

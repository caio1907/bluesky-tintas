export type Lab = {
  id: number,
  local: string,
  size: number
}

export type Schedule = {
  lab: number,
  dateStart: Date,
  dateEnd: Date,
  teacher: String
}

export type Providers = {
  uid: string
  name: string
  cnpj: string
}

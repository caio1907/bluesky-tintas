export type User = {
  uid: string
  first_name: string
  last_name: string
  email: string
  deleted?: boolean
  admin?: boolean
}

export type Providers = {
  uid: string
  name: string
  cnpj: string
}

export type Item = {
  uid?: string
  ean: string
  name: string
  provider: number
  min_quantity: number
  quantity: number
}

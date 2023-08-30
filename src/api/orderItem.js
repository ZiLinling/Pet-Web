import request from '@/utils/request'
import{ postRequest } from "@/api/axios"

export function delivery(url,data) {
  return postRequest(url,data)
}

export function identify(url,data) {
  return postRequest(url,data)
}

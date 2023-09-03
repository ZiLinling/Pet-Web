import request from '@/utils/request'
import{ postRequest } from "@/api/axios"


export function getSalesChart(url,data) {
  return postRequest(url,data)
}
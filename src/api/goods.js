import request from '@/utils/request'
import{ postRequest } from "@/api/axios"


export function getCategorySalesChart(url,data) {
  return postRequest(url,data)
}
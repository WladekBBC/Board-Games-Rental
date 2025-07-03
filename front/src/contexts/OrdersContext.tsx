import { Method, request } from "@/interfaces/api"
import { IOrder } from "@/interfaces/order"
import { ReactNode, useState } from "react"


export function OrdersContext ({children} : {children:ReactNode}){

    const [orders, setOrders] = useState<IOrder[]>([])

    const addOrder = async (order: Partial<IOrder>) => {
        return request<IOrder>('order/add', Method.POST, JSON.stringify(order)).then((newOrder)=>{setOrders([...orders, newOrder])})
    }
    
}

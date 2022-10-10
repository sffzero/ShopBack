//获取品牌管理数据模块  
import request from '@/utils/request'
//获取品牌列表接口
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => {
    return request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
}

//处理添加品牌操作
//新增品牌 /admin/product/baseTrademark/save post 携带参数：品牌名称，品牌logo
//切记：对于新增品牌，给服务器传递数据，不需要传递ID

//修改品牌 /admin/product/baseTrademark/update put 携带参数：id，品牌名称，品牌logo
//切记：对于修改某一个品牌的操作，前端需要带上id
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //带给服务器的数据携带id---修改   
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        //新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

//删除品牌接口
// /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTradeMark = (id) => {
    return request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
}
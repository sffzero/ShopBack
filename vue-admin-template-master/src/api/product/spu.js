import request from '@/utils/request'

//获取SPU列表数据的接口  /admin/product/{page}/{limit} get
export const reqSpuList = (page, limit, category3Id) => {
    return request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
}

//获取Spu信息接口 /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => {
    return request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
}

//获取品牌信息的接口 /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => {
    return request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
}

//获取Spu图片接口  /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => {
    return request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

//获取平台中所有销售属性 /admin/product/baseSaleAttrList 
export const reqBaseSaleAttrList = () => {
    return request({ url: '/admin/product/baseSaleAttrList ', method: 'get' })
}

//修改spu||添加spu  对于修改或者添加，携带给服务器参数大致是一样的，唯一的区别是携带的参数是否带id
export const reqAddOrUpdateSpu = (spuInfo) => {
    //携带参数带有id---修改spu
    if (spuInfo.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
    } else {
        //携带的参数不带id
        return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })

    }
}

//删除spu /admin/product/deleteSpu/${spuId}
export const reqDeleteSpu = (spuId) => {
    return request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
}
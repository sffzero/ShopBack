import request from '@/utils/request'
//获取图片接口  /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => {
    return request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

//获取销售属性数据 /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => {
    return request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
}

//获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}

//添加sku /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) => {
    return request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })
}

//获取SKU列表数据接口 /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => {
    return request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
}

//sku列表的接口 /admin/product/list/{page}/{limit}
export const reqskuList = (page, limit) => {
    return request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
}

//sku商品的上架接口 /admin/product/onSale/{skuId}
export const reqonSale = (skuId) => {
    return request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
}

//sku商品的下架接口 /admin/product/cancelSale/{skuId}
export const reqcancelSale = (skuId) => {
    return request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })
}

//获取sku商品详情信息 /admin/product/getSkuById/{skuId}
export const reqSkuDetail = (skuId) => {
    return request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
}
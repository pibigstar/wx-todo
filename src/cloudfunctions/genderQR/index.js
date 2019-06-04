//生成小程序二维码
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.wxacode.getUnlimited({
            page: event.page,
            scene: event.scene,
        })
        const uploadResult = await cloud.uploadFile({
            cloudPath: `temp/${new Date().getTime()}.png`,
            fileContent: result.buffer,
        })
        console.log(uploadResult.fileID);
        if (!uploadResult.fileID) {
            throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
        }
        return uploadResult.fileID
    } catch (err) {
        console.log(err)
    }
}
export const getElementInfo = (el) => {
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().select(el).boundingClientRect().exec(res => {
			 resolve(res)
		})
	})
	
}
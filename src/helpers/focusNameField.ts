export const focusNameField = (_this, item) => {
    _this.$refs[`fileName${item.id}`][0].focus()
}
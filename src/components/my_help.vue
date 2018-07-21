<template>
	<div class="box my_help tl">
		<div v-text='help_detail'>
			
		</div>
	</div>
</template>
<script>

export default {
	name: 'my_help',
	data () {
		return {
			help_detail: '',
		}
	},
	components: {
	},
	created () {
		let that = this
		that.$store.commit('updateTitleMsg', { title_msg: '使用帮助', })
		that.c_ajax({}, 'api.php?c=Cms&a=help', function (value) {
			if (value.data.status === 10001) {
				that.help_detail = value.data.details
			}
		})
	},
	methods: {
	},
	mounted () {
		this.getShare()
	},
}
</script>

<style scoped>
</style>

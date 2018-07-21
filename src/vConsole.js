import Vconsole from 'vconsole'

// 提取链接里的n
function getConsole (n) {
	let a = window.location.hash.split("?")[1], r = new RegExp("(^|&)" + n + "=([^&]*)(&|$)")
	if (a) { let r = a.match(r); return (r !== null) ? decodeURIComponent(r[2]) : null } return null
}

let vConsole = (getConsole('console')) ? new Vconsole() : 'not console'
export default vConsole
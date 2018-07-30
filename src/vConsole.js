import Vconsole from 'vconsole'

// 提取链接里的n
function getConsole (n) {
	let a = window.location.hash.split("?")[1], t = new RegExp("(^|&)" + n + "=([^&]*)(&|$)")
	if (a) { let r = a.match(t); console.log(r); return (r !== null) ? decodeURIComponent(r[2]) : null } return null
}

let vConsole = (getConsole('console')) ? new Vconsole() : 'not console'
export default vConsole
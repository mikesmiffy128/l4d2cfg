var left = document.getElementById("left")
var right = document.getElementById("right")
var out = document.getElementById("out")
var savelink = document.getElementById("savelink")

var gencfg = _ => {
	// happy string-munging fun adventures!!! :)))))
	var cfgfile = "// Auto-generated by https://mikesmiffy128.github.io/l4d2cfg\n"
	for (var i = 0; i < left.children.length; ++i) {
		var id = left.children[i].attributes["data-id"].value - 0
		var next = (i + 1) % left.children.length
		// modulo isn't really modulo, silly js
		var prev = (i - 1 + left.children.length) % left.children.length
		cfgfile += "alias !"+i+' "alias ! !'+next+"; alias !v !v"+next +
				"; alias !p !p"+next+"; say Next vote: " +
				left.children[next].innerText+'"\n'
		cfgfile += "alias !p"+i+' "alias ! !'+prev+"; alias !v !v"+prev +
				"; alias !p !p"+prev+"; say Next vote: " +
				left.children[prev].innerText+'"\n'
		cfgfile += "alias !v"+i+' "callvote ChangeMission L4D2C'+id+"; !"+i+'"\n'
	}
	cfgfile += "alias ! !1; alias !p !p1; alias !v !v1\n"
	cfgfile += "alias cycler_callvote !v\n"
	cfgfile += "alias cycler_next !\n"
	cfgfile += "alias cycler_prev !p\n"
	cfgfile += 'alias cycler_reset "alias ! !1; alias !v !v1; alias !p !p1' +
			'; say Cycler was reset"'
	cfgfile = cfgfile.replaceAll("!", "__cycler")
	out.textContent = cfgfile
	savelink.href = "data:text/plain;base64,"+btoa(cfgfile) // lol this works :D
}
gencfg() // init

var insertsorted = (container, el, id) => {
	// this is terribly inefficient but N is small so I don't care
	for (var i = 0; i < container.children.length; ++i) {
		if (container.children[i].attributes["data-id"].value - 0 > id) {
			if (el !== container.children[i - 1]) {
				container.insertBefore(el, container.children[i])
			}
			return
		}
	}
	if (el !== container.children[container.children.length - 1]) {
		container.appendChild(el)
	}
}

dragula([left, right], {
	revertOnSpill: true
}).on('shadow', (el, container) => {
	// bit of a hack I think but it works: enforce the order in
	// "excluded" pane to make the ui nice and consistent
	if (container !== right) return;
	// UGH YUCK
	var id = el.attributes["data-id"].value - 0
	insertsorted(container, el, id)
}).on("drop", gencfg)

var order_c5 = [2, 1, 0, 3, 4]
var order_s5 = [2, 0, 4, 3, 1]
var order_c13 = [4, 3, 2, 5, 6, 1, 11, 10, 7, 8, 9, 12, 0]
var setorder = o => {
	var toleft = []
	while (right.children.length) {
		var c = right.children[0]
		var id = c.attributes["data-id"].value - 0
		if (id > o.length) break
		c.parentNode.removeChild(c)
		toleft[o[id - 1]] = c
	}
	while (left.children.length) {
		var c = left.children[0]
		c.parentNode.removeChild(c)
		var id = c.attributes["data-id"].value - 0
		if (id <= o.length) toleft[o[id - 1]] = c
		else insertsorted(right, c, c.attributes["data-id"].value - 0)
	}
	for (var c of toleft) {console.log(c);left.appendChild(c)}
	gencfg()
}
document.getElementById("t-c5").onclick = _ => setorder(order_c5)
document.getElementById("t-s5").onclick = _ => setorder(order_s5)
document.getElementById("t-c13").onclick = _ => setorder(order_c13)

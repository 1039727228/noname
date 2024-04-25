import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { lib } from "../index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

export class Character {
	/**
	 * 武将牌的性别
	 * @type { string }
	 **/
	sex;
	/**
	 * 武将牌的体力值
	 * @type { number }
	 **/
	hp;
	/**
	 * 武将牌的体力上限
	 * @type { number }
	 **/
	maxHp;
	/**
	 * 武将牌的护甲值
	 * @type { number }
	 **/
	hujia = 0;
	/**
	 * 武将牌的势力
	 * @type { string }
	 **/
	group;
	/**
	 * 武将牌的势力边框颜色（如徐庶“身在曹营心在汉”）
	 * @type { string }
	 **/
	groupBorder;
	/**
	 * 神武将牌在国战模式下的势力
	 * @type { string }
	 **/
	groupInGuozhan;
	/**
	 * 武将牌拥有的技能
	 * @type { string[] }
	 **/
	skills = [];
	/**
	 * 武将牌是否为常备主公
	 * @type { boolean }
	 **/
	isZhugong = false;
	/**
	 * 武将牌是否为隐藏武将
	 * @type { boolean }
	 **/
	isUnseen = false;
	/**
	 * 武将牌是否拥有隐匿技能
	 * @type { boolean }
	 **/
	hasHiddenSkill = false;
	/**
	 * 垃圾桶，用于存储原本Character[4]的垃圾数据
	 * @type { Array }
	 **/
	trashBin = [];
	/**
	 * 武将牌对应的另一半双面武将牌
	 * @type { string }
	 **/
	dualSideCharacter;
	/**
	 * 多势力武将牌的全部势力
	 * @type { Array }
	 **/
	doubleGroup = [];
	/**
	 * 武将牌是否为minskin
	 * @type { boolean }
	 **/
	isMinskin = false;
	/**
	 * 武将牌是否为挑战模式下的BOSS
	 * @type { boolean }
	 **/
	isBoss = false;
	/**
	 * 武将牌是否为隐藏BOSS
	 * @type { boolean }
	 **/
	isHiddenBoss = false;
	/**
	 * 武将牌是否“仅点将可用”
	 * @type { boolean }
	 **/
	isAiForbidden = false;
	/**
	 * 武将牌在炉石模式/挑战模式下的特殊信息
	 * @type { array|undefined }
	 **/
	extraModeData;
	/**
	 * 武将牌是否为炉石模式下的随从
	 * @type { boolean }
	 **/
	isFellowInStoneMode = false;
	/**
	 * 武将牌是否为炉石模式下的隐藏武将
	 * @type { boolean }
	 **/
	isHiddenInStoneMode = false;
	/**
	 * 武将牌是否为炉石模式下的特殊随从（可以使用装备和法术）
	 * @type { boolean }
	 **/
	isSpecialInStoneMode = false;
	/**
	 * 武将牌是否为bossallowed
	 * @type { boolean }
	 **/
	isBossAllowed = false;
	/**
	 * 武将牌是否为战旗模式下的BOSS
	 * @type { boolean }
	 **/
	isChessBoss = false;
	/**
	 * 武将牌是否为剑阁模式下的BOSS
	 * @type { boolean }
	 **/
	isJiangeBoss = false;
	/**
	 * 武将牌是否为剑阁模式下的机械
	 * @type { boolean }
	 **/
	isJiangeMech = false;
	/**
	 * 武将牌是否在国战模式下拥有独立的皮肤
	 * @type { boolean }
	 **/
	hasSkinInGuozhan = false;
	/**
	 * 武将牌对应的全部宗族
	 * @type { string[] }
	 **/
	clans = [];
	/**
	 * 武将牌“无法享受到的主公/地主红利”
	 * @type { string[] }
	 **/
	initFilters = [];
	/**
	 * @param { Array|Object } [data]
	 */
	constructor(data) {
		if (Array.isArray(data)) {
			this.sex = data[0];
			this.group = data[1];
			this.hp = get.infoHp(data[2]);
			this.maxHp = get.infoMaxHp(data[2]);
			this.hujia = get.infoHujia(data[2]);
			this.skills = get.copy(data[3] || []);
			if (data[4]) Character.convertTrashToProperties(this, data[4]);
			if (data.length > 5) this.extraModeData = data[5];
		} else if (get.is.object(data)) {
			Object.assign(this, data);
			if (typeof this.maxHp !== "number") this.maxHp = this.hp;
		}
	}
	/**
	 * @param { Character } character
	 * @param { Array } trash
	 */
	static convertTrashToProperties(character, trash) {
		let keptTrashes = [],
			clans = [];
		for (let i = 0; i < trash.length; i++) {
			let item = trash[i];
			if (i === 0 && (lib.group.includes(item) || item === 'key')) {
				character.groupInGuozhan = item;
			} else if(item.startsWith("gzgroup:")){
				character.groupInGuozhan = item.slice(8);
			} else if (item === "zhu") {
				character.isZhugong = true;
			} else if (item === "unseen") {
				character.isUnseen = true;
			} else if (item === "minskin") {
				character.isMinskin = true;
			} else if (item === "gzskin") {
				character.hasSkinInGuozhan = true;
			} else if (item === "boss") {
				character.isBoss = true;
			} else if (item === "chessboss") {
				character.isChessBoss = true;
			} else if (item === "jiangeboss") {
				character.isJiangeBoss = true;
			} else if (item === "jiangemech") {
				character.isJiangeMech = true;
			} else if (item === "bossallowed") {
				character.isBossAllowed = true;
			} else if (item === "hiddenboss") {
				character.isHiddenBoss = true;
			} else if (item === "forbidai") {
				character.isAiForbidden = true;
			} else if (item === "stone") {
				character.isFellowInStoneMode = true;
			} else if (item === "stonehidden") {
				character.isHiddenInStoneMode = true;
			} else if (item === "stonespecial") {
				character.isSpecialInStoneMode = true;
			} else if (item === "hiddenSkill") {
				character.hasHiddenSkill = true;
			} else if (item.startsWith("border:")) {
				character.groupBorder = item.slice(7);
			} else if (item.startsWith("dualside:")) {
				character.dualSideCharacter = item.slice(9);
			} else if (item.startsWith("doublegroup:")) {
				character.doubleGroup = item.slice(12).split(":");
			} else if (item.startsWith("clan:")) {
				clans.push(item.slice(5));
			} else if (item.startsWith("InitFilter:")) {
				character.initFilters = item.slice(11).split(":");
			} else {
				keptTrashes.push(item);
			}
		}
		if (clans.length > 0) character.clans = clans;
		character.trashBin = keptTrashes;
	}
	/**
	 * @deprecated
	 */
	get 0() {
		return this.sex;
	}
	set 0(sex) {
		this.sex = sex;
	}

	/**
	 * @deprecated
	 */
	get 1() {
		return this.group;
	}
	set 1(group) {
		this.group = group;
	}

	/**
	 * @deprecated
	 */
	get 2() {
		if (this.hujia > 0) return `${this.hp}/${this.maxHp}/${this.hujia}`;
		else if (this.hp !== this.maxHp) return `${this.hp}/${this.maxHp}`;
		return this.hp;
	}
	set 2(hp) {
		this.hp = get.infoHp(hp);
		this.maxHp = get.infoMaxHp(hp);
		this.hujia = get.infoHujia(hp);
	}

	/**
	 * @deprecated
	 */
	get 3() {
		return this.skills;
	}
	set 3(skills) {
		this.skills = skills;
	}

	/**
	 * 把新格式下的数据转换回传统的屎山
     * @deprecated
	 */
	get 4() {
		const trashes = [],
			character = this;
		if (lib.group.includes(character.groupInGuozhan)) {
			trashes.push(`gzgroup:${character.groupInGuozhan}`);
		}
		if (character.isZhugong) {
			trashes.push("zhu");
		}
		if (character.isUnseen) {
			trashes.push("unseen");
		}
		if (character.isMinskin) {
			trashes.push("minskin");
		}
		if (character.hasSkinInGuozhan) {
			trashes.push("gzskin");
		}
		if (character.isBoss) {
			trashes.push("boss");
		}
		if (character.isChessBoss) {
			trashes.push("chessboss");
		}
		if (character.isJiangeBoss) {
			trashes.push("jiangeboss");
		}
		if (character.isJiangeMech) {
			trashes.push("jiangemech");
		}
		if (character.isBossAllowed) {
			trashes.push("bossallowed");
		}
		if (character.isHiddenBoss) {
			trashes.push("hiddenboss");
		}
		if (character.isAiForbidden) {
			trashes.push("forbidai");
		}
		if (character.isFellowInStoneMode) {
			trashes.push("stone");
		}
		if (character.isHiddenInStoneMode) {
			trashes.push("stonehidden");
		}
		if (character.isSpecialInStoneMode) {
			trashes.push("stonespecial");
		}
		if (character.hasHiddenSkill) {
			trashes.push("hiddenSkill");
		}
		if (character.groupBorder) {
			trashes.push(`border:${character.groupBorder}`);
		}
		if (character.dualSideCharacter) {
			trashes.push(`duaslside:${character.dualSideCharacter}`);
		}
		if (character.doubleGroup.length > 0) {
			trashes.push(`doublegroup:${character.doubleGroup.join(":")}`);
		}
		if (character.clans.length > 0) {
			character.clans.forEach((item) => trashes.push(`clan:${item}`));
		}
		if (character.initFilters.length > 0) {
			trashes.push(`InitFilters:${character.initFilters.join(":")}`);
		}

		return trashes.concat(character.trashBin);
	}
	set 4(trashBin) {
		console.warn("你set你🐎的废弃属性");
	}

	get 5(){
		return this.extraModeData;
	}
	set 5(stoneData){
		this.extraModeData = stoneData;
	}
}

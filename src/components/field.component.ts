import { FIELD_TEMPLATE } from '../templates/field.template'
import { Echoable } from '../interfaces/echoable'
import { BaseComponent } from './base.component'

export class FieldComponent extends BaseComponent implements Echoable {
	name: string
	nonNullableAssertion: boolean
	preserveDefaultNullable: boolean
	nullable: boolean
	useUndefinedDefault: boolean
	jsonTypeNamespace?: string
	default?: string
	type?: string
	documentation?: string

	echo = () => {
		let name = this.name
		let type = this.type
		if (
			this.jsonTypeNamespace &&
			this.documentation &&
			/^\[.*\]$/.test(this.documentation)
		) {
			type = `${this.jsonTypeNamespace}.${this.documentation.replace(
				/(^\[|\]$)/g,
				'',
			)}`
		}
		if (this.nullable === true) {
			if (this.preserveDefaultNullable) {
				type += ' | null'
			} else {
				name += '?'
			}
		} else if (this.nonNullableAssertion === true) {
			name += '!'
		}

		let defaultValue = ''
		if (this.default) {
			if (!isNaN(Date.parse(this.default)) && this.type !== 'number') {
				defaultValue = `= new Date('${this.default}')`
			} else {
				defaultValue = `= ${this.default}`
			}
		} else {
			if (this.useUndefinedDefault === true) {
				defaultValue = `= undefined`
			}
		}

		return FIELD_TEMPLATE.replace('#!{NAME}', name)
			.replace('#!{NAME}', name)
			.replace('#!{TYPE}', type)
			.replace('#!{DECORATORS}', this.echoDecorators())
			.replace('#!{DEFAULT}', defaultValue)
	}

	constructor(obj: {
		name: string
		useUndefinedDefault: boolean
		jsonTypeNamespace?: string
		documentation?: string
	}) {
		super(obj)
	}
}

if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  )
Array.prototype.equals = function (array) {
  if (!array) return false
  if (array === this) return true
  if (this.length != array.length) return false

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) return false
    } else if (this[i] instanceof Object && array[i] instanceof Object) {
      if (!this[i].equals(array[i])) return false
    } else if (this[i] != array[i]) {
      return false
    }
  }
  return true
}

Object.prototype.equals = function (object2) {
  for (propName in this) {
    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
      return false
    } else if (typeof this[propName] != typeof object2[propName]) {
      return false
    }
  }

  for (propName in object2) {
    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
      return false
    } else if (typeof this[propName] != typeof objec2[propName]) {
      return false
    }

    if (!this.hasOwnProperty(propName)) continue

    if (this[propName] instanceof Array && object2[propName] instanceof Array) {
      if (!this[propName].equals(object2[propName])) return false
    } else if (
      this[propName] instanceof Object &&
      object2[propName] instanceof Object
    ) {
      if (!this[propName].equals(object2[propName])) return false
    } else if (this[propName] != object2[propName]) {
      return false
    }
  }

  return true
}

Object.defineProperty(Array.prototype, 'equals', { enumerable: false })

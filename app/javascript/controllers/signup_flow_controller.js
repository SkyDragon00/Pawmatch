import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "message"]

  connect() {
    this.currentStep = 0
    this.showStep(this.currentStep)
  }

  next(event) {
    event.preventDefault()

    if (!this.validateCurrentStep()) {
      return
    }

    this.showStep(Math.min(this.currentStep + 1, this.stepTargets.length - 1))
  }

  back(event) {
    event.preventDefault()
    this.showStep(Math.max(this.currentStep - 1, 0))
  }

  finish(event) {
    event.preventDefault()

    if (!this.validateCurrentStep()) {
      return
    }

    this.messageTarget.textContent = "Your Pawmatch profile is ready. This demo flow is now wired for the signup basics."
    this.messageTarget.classList.remove("is-hidden")
    this.element.reset()
    this.showStep(0)
  }

  showStep(stepIndex) {
    this.currentStep = stepIndex

    this.stepTargets.forEach((stepElement, index) => {
      stepElement.hidden = index !== stepIndex
    })
  }

  validateCurrentStep() {
    const fields = this.stepTargets[this.currentStep].querySelectorAll("input, select, textarea")

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity()
        return false
      }
    }

    return true
  }
}
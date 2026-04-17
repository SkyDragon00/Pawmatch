import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["step", "message", "indicator", "stepLabel"]

  connect() {
    this.currentStep = 0
    this.messageTarget.classList.add("hidden")
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

    this.stepTargets.forEach((stepElement) => {
      stepElement.hidden = true
    })

    this.messageTarget.textContent = "Profile created. Your dog is ready to start matching on Pawmatch."
    this.messageTarget.classList.remove("hidden")

    if (this.hasStepLabelTarget) {
      this.stepLabelTarget.textContent = "Completed"
    }

    this.indicatorTargets.forEach((indicator) => {
      indicator.classList.remove("bg-outline-variant/30")
      indicator.classList.add("bg-primary")
    })
  }

  showStep(stepIndex) {
    this.currentStep = stepIndex

    this.stepTargets.forEach((stepElement, index) => {
      stepElement.hidden = index !== stepIndex
    })

    this.indicatorTargets.forEach((indicator, index) => {
      if (index <= stepIndex) {
        indicator.classList.remove("bg-outline-variant/30")
        indicator.classList.add("bg-primary")
      } else {
        indicator.classList.remove("bg-primary")
        indicator.classList.add("bg-outline-variant/30")
      }
    })

    if (this.hasStepLabelTarget) {
      this.stepLabelTarget.textContent = `Step ${stepIndex + 1} of ${this.stepTargets.length}`
    }
  }

  validateCurrentStep() {
    const currentStep = this.stepTargets[this.currentStep]
    const fields = currentStep.querySelectorAll("input, select, textarea")

    const lookingForOptions = currentStep.querySelectorAll('input[name="looking_for[]"]')

    if (lookingForOptions.length > 0) {
      const hasSelection = Array.from(lookingForOptions).some((option) => option.checked)

      lookingForOptions.forEach((option) => {
        option.setCustomValidity(hasSelection ? "" : "Select at least one option")
      })

      if (!hasSelection) {
        lookingForOptions[0].reportValidity()
        return false
      }
    }

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity()
        return false
      }
    }

    return true
  }
}
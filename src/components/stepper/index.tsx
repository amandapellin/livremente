import { Stepper as MuiStepper, Step, StepLabel } from '@mui/material'

export interface StepperProps {
	steps: readonly string[]
	activeStep: number
}

export default function Stepper({ steps, activeStep }: StepperProps) {
	return (
		<MuiStepper activeStep={activeStep} alternativeLabel sx={{ width: '100%' }}>
			{steps.map((label) => (
				<Step key={label}>
					<StepLabel>{label}</StepLabel>
				</Step>
			))}
		</MuiStepper>
	)
}

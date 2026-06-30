import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryState {
	hasError: boolean
}

interface ErrorBoundaryProps {
	children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.info('ERROR: ', error)
		console.info('Error Info: ', errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='bg-white w-full h-dvh p-20'>
					<h2 className='block font-semibold text-xl'>Lo sentimos. Ocurrió un error inesperado.</h2>
					<p>Cierra el sistema y vuelve a abrirlo.</p>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary

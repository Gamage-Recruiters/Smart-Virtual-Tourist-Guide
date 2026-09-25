import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/travelPackage/Header.jsx'
import Footer from '../../components/travelPackage/Footer.jsx'
import locationImage from '../../assets/travelPackage/location.png'
import AddNewPackage from './AddNewPackage.jsx'


export default function SucessPackage({ embedLayout = false, packageData = null, isEditing = false, onEdit }) {
	const navigate = useNavigate()
	const handleEdit = () => {
		if (onEdit) onEdit()
		else navigate(`/packages/edit/${packageData?._id}`)
	}
	const packageTitle = packageData?.BasicInformation?.title || ''
	const packageDestination = packageData?.LocationAndHighlights?.destination || ''
	const packageImages = packageData?.LocationAndHighlights?.images || []
	const packageImage = packageImages[0] || null
	const packagePrice = typeof packageData?.BasicInformation?.price === 'number'
		? `$${packageData.BasicInformation.price.toFixed(2)}`
		: ''
	const packageDescription = packageData?.BasicInformation?.description || ''

	const mainContent = (
		<main
			style={{
				flex: 1,
				minHeight: '100vh',
				background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
				paddingTop: '180px',
				paddingBottom: '80px',
			}}
		>
			<div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px' }}>
				<div style={{ textAlign: 'center', marginBottom: '28px' }}>
					<div
						style={{
							width: '60px',
							height: '60px',
							margin: '0 auto 14px',
							borderRadius: '999px',
							background: '#C7EBD1',
							border: '2px solid #8BC89D',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#2F855A',
							fontSize: '30px',
							fontWeight: 700,
						}}
					>
						✓
					</div>
					<h1
						style={{
							margin: 0,
							fontSize: '32px',
							fontWeight: 700,
							color: '#111827',
							fontFamily: "'Inter', sans-serif",
						}}
					>
						{isEditing ? 'Successfully Edited' : 'Successfully Published'}
					</h1>
					<p
						style={{
							margin: '6px 0 0',
							fontSize: '16px',
							color: '#6B7280',
							fontFamily: "'Inter', sans-serif",
						}}
					>
						{isEditing ? 'Your Travel Package Has Been Updated Successfully.' : 'Your Travel Package Is Now Live And Visible To Users.'}
					</p>
				</div>

				<div
					style={{
						background: '#FFFFFF',
						borderRadius: '10px',
						border: '1px solid #D9E2EC',
						boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
						padding: '18px',
					}}
				>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '360px 1fr',
							gap: '20px',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								background: '#F3F4F6',
								borderRadius: '10px',
								overflow: 'hidden',
								height: '300px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{packageImage ? (
								<img
									src={packageImage}
									alt={packageTitle || 'Uploaded package image'}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<div style={{ color: '#9CA3AF', fontSize: '15px', textAlign: 'center', padding	: '16px' }}>
									No uploaded image returned by the server
								</div>
							)}
						</div>

						<div>
							<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
								<div>
									<h2
										style={{
											margin: 0,
											fontSize: '24px',
											fontWeight: 700,
											color: '#111827',
											fontFamily: "'Inter', sans-serif",
										}}
									>
										{packageTitle || 'Package title unavailable'}
									</h2>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: '#6B7280' }}>
										<img 
											src={locationImage} 
											alt="Location Icon" 
											style={{ width: '16px', height: '16px' }} 
										/>
										<span style={{ fontSize: '16px' }}>{packageDestination || 'Sri Lanka'}</span>
                                    </div>


								</div>
								<div
									style={{
										fontSize: '18px',
										fontWeight: 700,
										color: '#111827',
										fontFamily: "'Inter', sans-serif",
									}}
								>
									{packagePrice || 'Price unavailable'}
								</div>
							</div>

							<div style={{ height: '2px', background: '#E5E7EB', margin: '16px 0' }} />

							<p
								style={{
									margin: 0,
									color: '#6B7280',
									fontSize: '15px',
									lineHeight: 1.8,
									fontFamily: "'Inter', sans-serif",
								}}
							>
								{packageDescription || 'No description was returned for this package.'}
							</p>
						</div>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr 1fr',
							gap: '16px',
							marginTop: '22px',
						}}
					>
						<button
							type="button"
							onClick={() => navigate(`/packages/view/${packageData._id}`)}
							style={{
								height: '40px',
								borderRadius: '8px',
								background: '#2563EB',
								color: '#FFFFFF',
								border: 'none',
								fontSize: '15px',
								fontWeight: 600,
								cursor: 'pointer',
							}}
						>
							View Package
						</button>
						<button
						type="button"
						onClick={handleEdit}
						style={{
							height: '40px',
							borderRadius: '8px',
							background: '#F3F4F6',
							color: '#6B7280',
							border: 'none',
							fontSize: '15px',
							fontWeight: 600,
							cursor: 'pointer',
						}}
						>
						Edit Package
						</button>
						<button
							type="button"
							style={{
								height: '40px',
								borderRadius: '8px',
								background: '#FACC15',
								color: '#111827',
								border: 'none',
								fontSize: '15px',
								fontWeight: 600,
								cursor: 'pointer',
							}}
						>
							Share Package
						</button>
					</div>
				</div>
			</div>
		</main>
	)

	if (embedLayout) {
		return mainContent
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				background: 'linear-gradient(180deg, #FFFFFF 0%, #A0DBFF 100%)',
			}}
		>
			<Header />
			{mainContent}
			<Footer />
		</div>
	)
}

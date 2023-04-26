import React, { ReactNode, useState } from 'react'
import { Box, Text } from "@chakra-ui/react"

interface ICustomTooltipProps {
    name: string,
    children: ReactNode
}

export default function CustomTooltip({ name, children }: ICustomTooltipProps){
    const [showName, setShowName] = useState<boolean>(false)

    const hoverStyles = {
        opacity: 1,
        transition: 'all 0.4s ease-in-out'
    }

    return (
        <Box position={'relative'}>
            <Box onMouseEnter={() => setShowName(true)} onMouseLeave={() => setShowName(false)}>
                { children }
            </Box>

            <Box position={'absolute'} pointerEvents='none' zIndex='999' sx={showName ? hoverStyles : null} opacity='0' bgColor='#CC943C' left='50%' top='40px' transform='translateX(-50%)' w='max-content' p='2px 12px' borderRadius={'3px'}>
                <Text as='span' color='black' fontWeight={'600'} fontSize='0.875rem'>{name}</Text>
            </Box>      
        </Box>
    )
}
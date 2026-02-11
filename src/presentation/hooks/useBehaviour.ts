import { KeyboardAvoidingViewProps, Platform } from 'react-native'

export function useBehaviour() {
    // Ovdje je neki problem sa behaviourom KeyboardAvoidingViewa, nisam imao vremena da istrazim u dubinu bas
    // Na Android emulatoru je radio kako treba sa height, dok na fizickom uredjaju nije,
    // ali je razlika izmedju Android verzija, pa sam sad za sada ostavio ovako.
    const behavior: KeyboardAvoidingViewProps['behavior'] =
        Platform.OS === 'ios' ? 'padding'
            : typeof Platform.Version === 'number' && Platform.Version > 34 ? 'height' : undefined

    return behavior
}
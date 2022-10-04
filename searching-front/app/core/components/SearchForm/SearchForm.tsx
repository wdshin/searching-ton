import { Routes } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Button from "app/auth/components/Button/Button"
import { cn } from "app/core/helpers/common"
import i18n from "app/i18n"
import upsertSearchRequest from "app/search-requests/mutations/upsertSearchRequest"
import getSearchRequests from "app/search-requests/queries/getSearchRequests"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useKeyPressEvent } from "react-use"
import useKeypress from "react-use-keypress"
import Modal from "../Modal/Modal"

import s from "./styles.module.css"

const SearchForm = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [value, setValue] = useState(router.query.query as string)
  const [focusedSuggestion, setFocusedSuggestion] = useState<number | null>(null)
  const [inputIsFocused, setInputFocused] = useState(false)

  const onChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (focusedSuggestion) {
      setFocusedSuggestion(null)
    }
  }
  let [suggestions] = useQuery(
    getSearchRequests,
    { text: value },
    { suspense: false, keepPreviousData: true }
  )

  const blurInput = () => {
    setInputFocused(false)
    inputRef.current?.blur()
  }

  const focusInput = () => {
    setInputFocused(true)
    inputRef.current?.focus()
  }

  const onSubmit = async (val?: string) => {
    const query = val || value
    val && setValue(val)
    setFocusedSuggestion(null)
    await router.push(Routes.SearchPage({ query }))
  }

  const filteredSuggestion = suggestions?.filter((item) => item.text !== value)
  const shouldShowSuggestion = filteredSuggestion && !!filteredSuggestion.length

  useKeyPressEvent("Enter", async () => {
    if (inputIsFocused) {
      blurInput()
      if (filteredSuggestion?.length && suggestions && focusedSuggestion) {
        await onSubmit(filteredSuggestion[focusedSuggestion - 1]?.text)
      } else {
        await onSubmit(value)
      }
    } else {
      focusInput()
    }
  })

  useKeyPressEvent("ArrowUp", async (event) => {
    event.stopImmediatePropagation()
    if (inputIsFocused) {
      if (focusedSuggestion) {
        if (focusedSuggestion === 1) {
          return setFocusedSuggestion(null)
        }
        return setFocusedSuggestion((val) => (val ? val - 1 : null))
      } else {
        setFocusedSuggestion(suggestions?.length || null)
      }
    }
  })

  useKeyPressEvent("ArrowDown", async (event) => {
    if (inputIsFocused) {
      if (focusedSuggestion) {
        if (focusedSuggestion === suggestions?.length) {
          return setFocusedSuggestion(null)
        }
        return setFocusedSuggestion((val) => (val ? val + 1 : null))
      } else {
        setFocusedSuggestion(1)
      }
    }
  })

  useKeyPressEvent("Escape", async (event) => {
    if (inputIsFocused) {
      blurInput()
    }
  })

  const onSuggestionClick = (val: string) => async () => {
    setValue(val)
    await onSubmit(val)
  }

  const onInputBlur = useCallback(() => {
    setInputFocused(false)
  }, [])

  const onInputFocus = useCallback(() => {
    setInputFocused(true)
  }, [])

  
  debugger
  return (
    <AnimatePresence>
      <motion.div layoutId="searchForm" className={s.root}>
        <div className={s.inputWrapper}>
          <input
            onBlur={onInputBlur}
            onFocus={onInputFocus}
            onChange={onChange}
            value={value}
            className={s.input}
            placeholder={t("search.placeholder")}
            ref={inputRef}
          />
          <AnimatePresence>
            {value && (
              <Button
                key="searchButton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                onClick={() => onSubmit()}
                className={s.button}
                theme="primary"
              >
                {t("search.button")}
              </Button>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {inputIsFocused && (
            <>
              {shouldShowSuggestion && (
                <motion.div
                  key="modal"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={s.suggestions}
                >
                  {filteredSuggestion.map((item, index) => (
                    <div
                      key={item.text}
                      onClick={onSuggestionClick(item.text)}
                      className={cn(s.suggestion, {
                        [s.focusedSuggestion]: index + 1 === focusedSuggestion,
                      })}
                    >
                      {item.text}
                    </div>
                  ))}
                </motion.div>
              )}

              <Modal>
                <motion.div
                  key="modal1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={s.suggestionsOverlay}
                />
              </Modal>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchForm

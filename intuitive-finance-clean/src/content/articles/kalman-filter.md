---
title: "Kalman Filter"
description: "A step-by-step derivation of the Kalman Filter, including prediction, correction, covariance updates, and maximum-likelihood parameter estimation."
section: "filtering"
order: 20
draft: false
---

## 1. State-Space Model

### Transition Equation

$$
\mathbf{x}_t
=
\mathbf{A}_t\mathbf{x}_{t-1}
+
\mathbf{W}_t\mathbf{w}_t
$$

where:

- $\mathbf{x}_t\in\mathbb{R}^{n_x}$ = Hidden (latent) state variable/vector.

- $\mathbf{A}_t\in\mathbb{R}^{n_x\times n_x}$ = State transition matrix mapping the previous hidden state $\mathbf{x}_{t-1}$ into the current hidden state $\mathbf{x}_t$.

- $\mathbf{w}_t\in\mathbb{R}^{n_w}$ = Hidden process noise variable/vector with zero mean, representing random shocks in the evolution of the hidden state.

- $\mathbf{W}_t\in\mathbb{R}^{n_x\times n_w}$ = Matrix that maps the process noise $\mathbf{w}_t$ into the hidden state equation.

- $\mathbf{Q}_t=\mathbb{E}[\mathbf{w}_t\mathbf{w}_t^{\prime}]\in\mathbb{R}^{n_w\times n_w}$ = Covariance matrix of the process noise $\mathbf{w}_t$.

### Measurement Equation

$$
\mathbf{z}_t
=
\mathbf{H}_t\mathbf{x}_t
+
\mathbf{U}_t\mathbf{u}_t
$$

where:

- $\mathbf{z}_t\in\mathbb{R}^{n_z}$ = Observed measurement variable/vector.

- $\mathbf{H}_t\in\mathbb{R}^{n_z\times n_x}$ = Measurement matrix mapping the current hidden state $\mathbf{x}_t$ into the observed variable $\mathbf{z}_t$.

- $\mathbf{u}_t\in\mathbb{R}^{n_u}$ = Measurement noise variable/vector with zero mean, representing random errors affecting the observed measurement.

- $\mathbf{U}_t\in\mathbb{R}^{n_z\times n_u}$ = Matrix that maps the measurement noise $\mathbf{u}_t$ into the measurement equation.

- $\mathbf{R}_t=\mathbb{E}[\mathbf{u}_t\mathbf{u}_t^{\prime}]\in\mathbb{R}^{n_u\times n_u}$ = Covariance matrix of the measurement noise $\mathbf{u}_t$.

## 2. Algorithm

Kalman Filter proceeds in initialization and two recursive steps as follows:

### (0) Initialization

$$
\widehat{\mathbf{x}}_{0\mid 0}=\mathbf{x}_0
$$

$$
\mathbf{P}_{0\mid 0}=\mathbf{P}_0
$$

**Recursive loop for $t=1$ to $N$:**

### (1) Prediction (Time Update)

Using all observations up to time $t-1$, we can predict the distribution of the hidden state at time $t$:

$$
p\!\left(\mathbf{x}_{t-1}\mid\mathbf{z}_{1:t-1}\right)
\longrightarrow
p\!\left(\mathbf{x}_t\mid\mathbf{z}_{1:t-1}\right)
$$

and specifically due to the Markov property and the zero mean of the process noise, we can estimate hidden state a priori by using the previous filtered estimate of the hidden state as:

$$
\overbrace{\widehat{\mathbf{x}}_{t\mid t-1}}^{\substack{\text{Prior conditional}\\\text{expectation of }\mathbf{x}_t}}
=
\mathbb{E}\!\left[\mathbf{x}_t\mid\mathbf{z}_{1:t-1}\right]
=
\mathbb{E}\!\left[
\mathbf{A}_t\mathbf{x}_{t-1}
+
\mathbf{W}_t\mathbf{w}_t
\mid
\mathbf{z}_{1:t-1}
\right]
=
\mathbf{A}_t\widehat{\mathbf{x}}_{t-1\mid t-1}.
$$

Then by considering estimation errors:

$$
\mathbf{e}_{t\mid t-1}
=
\mathbf{x}_t-
\widehat{\mathbf{x}}_{t\mid t-1}
$$

$$
\mathbf{e}_{t-1\mid t-1}
=
\mathbf{x}_{t-1}-
\widehat{\mathbf{x}}_{t-1\mid t-1}
$$

A priori error covariance, variance in case $\mathbf{x}_t$ is scalar, representing uncertainty of estimate $\widehat{\mathbf{x}}_{t\mid t-1}$ is:

$$
\overbrace{\mathbf{P}_{t\mid t-1}}^{\substack{\text{Prior uncertainty of}\\\widehat{\mathbf{x}}_{t\mid t-1}\text{ estimate}}}
=
\mathbb{E}\!\left[
\left(\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t-1}\right)
\left(\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t-1}\right)^{\prime}
\right]
=
\mathbb{E}\!\left[
\mathbf{e}_{t\mid t-1}\mathbf{e}_{t\mid t-1}^{\prime}
\right]
\in\mathbb{R}^{n_x\times n_x}.
$$

This can be further written down as:

$$
\begin{aligned}
\mathbf{P}_{t\mid t-1}
&=
\mathbb{E}\!\Big[
\big(
\mathbf{A}_t\mathbf{x}_{t-1}
+
\mathbf{W}_t\mathbf{w}_t
-
\mathbf{A}_t\widehat{\mathbf{x}}_{t-1\mid t-1}
\big)
\cdot
\big(
\mathbf{A}_t\mathbf{x}_{t-1}
+
\mathbf{W}_t\mathbf{w}_t
-
\mathbf{A}_t\widehat{\mathbf{x}}_{t-1\mid t-1}
\big)^{\prime}
\Big]
\\[0.4em]
&=
\mathbb{E}\!\Big[
\big(
\mathbf{A}_t(\mathbf{x}_{t-1}-\widehat{\mathbf{x}}_{t-1\mid t-1})
+
\mathbf{W}_t\mathbf{w}_t
\big)
\cdot
\big(
\mathbf{A}_t(\mathbf{x}_{t-1}-\widehat{\mathbf{x}}_{t-1\mid t-1})
+
\mathbf{W}_t\mathbf{w}_t
\big)^{\prime}
\Big]
\\[0.4em]
&=
\mathbb{E}\!\left[
\left(
\mathbf{A}_t\mathbf{e}_{t-1\mid t-1}
+
\mathbf{W}_t\mathbf{w}_t
\right)
\left(
\mathbf{A}_t\mathbf{e}_{t-1\mid t-1}
+
\mathbf{W}_t\mathbf{w}_t
\right)^{\prime}
\right]
\\[0.4em]
&=
\mathbb{E}\!\Big[
\mathbf{A}_t\mathbf{e}_{t-1\mid t-1}
\mathbf{e}_{t-1\mid t-1}^{\prime}\mathbf{A}_t^{\prime}
+
\mathbf{A}_t\mathbf{e}_{t-1\mid t-1}\mathbf{w}_t^{\prime}\mathbf{W}_t^{\prime}
+
\mathbf{W}_t\mathbf{w}_t\mathbf{e}_{t-1\mid t-1}^{\prime}\mathbf{A}_t^{\prime}
+
\mathbf{W}_t\mathbf{w}_t\mathbf{w}_t^{\prime}\mathbf{W}_t^{\prime}
\Big]
\\[0.4em]
&=
\mathbf{A}_t\mathbb{E}\!\left[
\mathbf{e}_{t-1\mid t-1}\mathbf{e}_{t-1\mid t-1}^{\prime}
\right]\mathbf{A}_t^{\prime}
+
\mathbf{A}_t\mathbb{E}\!\left[
\mathbf{e}_{t-1\mid t-1}\mathbf{w}_t^{\prime}
\right]\mathbf{W}_t^{\prime}
\\
&\quad+
\mathbf{W}_t\mathbb{E}\!\left[
\mathbf{w}_t\mathbf{e}_{t-1\mid t-1}^{\prime}
\right]\mathbf{A}_t^{\prime}
+
\mathbf{W}_t\mathbb{E}\!\left[
\mathbf{w}_t\mathbf{w}_t^{\prime}
\right]\mathbf{W}_t^{\prime}.
\end{aligned}
$$

where

$$
\mathbf{P}_{t-1\mid t-1}
=
\mathbb{E}\!\left[
\mathbf{e}_{t-1\mid t-1}\mathbf{e}_{t-1\mid t-1}^{\prime}
\right],
$$

$$
\mathbb{E}\!\left[
\mathbf{e}_{t-1\mid t-1}\mathbf{w}_t^{\prime}
\right]
=
\mathbf{0},
\qquad
\mathbb{E}\!\left[
\mathbf{w}_t\mathbf{e}_{t-1\mid t-1}^{\prime}
\right]
=
\mathbf{0},
$$

and

$$
\mathbf{Q}_t
=
\mathbb{E}\!\left[
\mathbf{w}_t\mathbf{w}_t^{\prime}
\right],
$$

so:

$$
\begin{aligned}
\overbrace{\mathbf{P}_{t\mid t-1}}^{\substack{\text{Prior uncertainty of}\\\widehat{\mathbf{x}}_{t\mid t-1}\text{ estimate}}}
&=
\overbrace{
\mathbf{A}_t\mathbf{P}_{t-1\mid t-1}\mathbf{A}_t^{\prime}
}^{\substack{
\text{Uncertainty of }\widehat{\mathbf{x}}_{t-1\mid t-1}\text{ estimate}\\
\text{propagated by }\mathbf{A}_t\text{ into the uncertainty}\\
\text{of the predicted state at time }\math{t}
}}
+
\overbrace{
\mathbf{W}_t\mathbf{Q}_t\mathbf{W}_t^{\prime}
}^{\substack{
\text{Uncertainty of }\mathbf{w}_t\text{ propagated}\\
\text{by }\mathbf{W}_t\text{ into the uncertainty of}\\
\text{the predicted state at time }\math{t}
}}.
\end{aligned}
$$

### (2) Correction (Measurement Update)

After observing the new data point $\mathbf{z}_t$, we can update the predicted distribution of the hidden state at time $t$ to be more accurate:

$$
p\!\left(\mathbf{x}_t\mid\mathbf{z}_{1:t-1}\right)
\longrightarrow
p\!\left(\mathbf{x}_t\mid\mathbf{z}_{1:t}\right)
$$

By combining the previously predicted state estimate $\widehat{\mathbf{x}}_{t\mid t-1}$ with the new observation $\mathbf{z}_t$, we obtain the corrected a posteriori estimate of the hidden state using the following State Update Equation:

$$
\begin{aligned}
\overbrace{\widehat{\mathbf{x}}_{t\mid t}}^{\substack{\text{Posterior conditional}\\\text{expectation of }\mathbf{x}_t}}
&=
\mathbb{E}\!\left[\mathbf{x}_t\mid\mathbf{z}_{1:t}\right]
 =
\widehat{\mathbf{x}}_{t\mid t-1}
+
\mathbf{K}_t\boldsymbol{\nu}_t
\\
&=
\overbrace{
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
}^{\substack{\text{Prior-state estimate}\\
\text{weight adjusted by }\mathbf{H}_t}}
\widehat{\mathbf{x}}_{t\mid t-1}
+
\overbrace{\mathbf{K}_t}^{\text{Measurement weight}}
\mathbf{z}_t.
\end{aligned}
$$

where:

- $\boldsymbol{\nu}_t$ = Innovation process representing the surprise in the new observation, i.e. how badly the observed variable was predicted. For a given Kalman Gain, a larger innovation produces a greater correction to the predicted hidden-state estimate, and vice versa.
$$
\boldsymbol{\nu}_t
      =
      \mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
      =
      \mathbf{H}_t\mathbf{x}_t+\mathbf{U}_t\mathbf{u}_t
      -\mathbf{H}_t\widehat{\mathbf{x}}_{t\mid t-1}
      \in\mathbb{R}^{n_z}
$$

- $\mathbf{K}_t$ = Kalman Gain representing the sensitivity of the corrected hidden-state estimate to the innovation process $\boldsymbol{\nu}_t$, i.e., it determines how strongly the predicted estimate is corrected. Greater sensitivity associated with $\mathbf{K}_t$ means that the same innovation produces a larger correction, and vice versa. The Kalman Gain is chosen to minimize the posterior estimation uncertainty represented by $\mathbf{P}_{t\mid t}$.
$$
\begin{aligned}
      \mathbf{K}_t
      &=
      \frac{
      \text{\small\itshape (Incomplete) uncertainty of predicted observation}
      }{
      \text{\small\itshape Uncertainty of predicted observation}
      +
      \text{\small\itshape Uncertainty of measurement noise}
      }
      \\[0.5em]
      &=
      \mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{C}_{t\mid t-1}^{-1}
      =
      \mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}
      \left(
      \mathbf{H}_t\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}
      +
      \mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}
      \right)^{-1}
      \in\mathbb{R}^{n_x\times n_z}
      \end{aligned}
$$

- $\mathbf{C}_{t\mid t-1}$ = Covariance matrix of the innovation process, representing the total uncertainty of the observed measurement variable. It combines the uncertainty of the predicted observation arising from uncertainty in the predicted hidden state with the uncertainty caused by measurement noise.
$$
\mathbf{C}_{t\mid t-1}
      =
      \mathbb{E}\!\left[
      \boldsymbol{\nu}_t\boldsymbol{\nu}_t^{\prime}
      \right]
      =
      \underbrace{
      \mathbf{H}_t\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}
      }_{\substack{
      \text{Predicted-state uncertainty projected}\\
      \text{into observation space by }\mathbf{H}_t
      }}
      +
      \underbrace{
      \mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}
      }_{\substack{
      \text{Measurement-noise uncertainty projected}\\
      \text{into observation space by }\mathbf{U}_t
      }}
      \in\mathbb{R}^{n_z\times n_z}.
$$

- $\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}$ = Cross-covariance matrix obtained by propagating the predicted-state uncertainty toward the observation space through the right-side transformation $\mathbf{H}_t^{\prime}$. The missing left transformation by $\mathbf{H}_t$ appears explicitly later in the weight $\mathbf{I}-\mathbf{K}_t\mathbf{H}_t$ applied to the prior state estimate, while on the observation side it is implicitly reflected in $\mathbf{K}_t\mathbf{z}_t$ through the measurement equation $\mathbf{z}_t=\mathbf{H}_t\mathbf{x}_t+\mathbf{U}_t\mathbf{u}_t$.

Finally, the a posteriori error covariance, representing the uncertainty of the corrected hidden-state estimate $\widehat{\mathbf{x}}_{t\mid t}$, can be expressed as follows:

$$
\mathbf{P}_{t\mid t}
=
\left(
\mathbf{I}-\mathbf{K}_t\mathbf{H}_t
\right)
\mathbf{P}_{t\mid t-1}.
$$

Intuitively, we are correcting the predicted distribution using the information contained in the new observation $\mathbf{z}_t$.

This formula can be derived as follows:

$$
\begin{aligned}
\mathbf{P}_{t\mid t}
&=
\mathbb{E}\!\left[
\mathbf{e}_{t\mid t}\mathbf{e}_{t\mid t}^{\prime}
\right]
\\[4pt]
&=
\mathbb{E}\!\left[
\left(
\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t}
\right)
\left(
\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t}
\right)^{\prime}
\right]
\\[4pt]
&=
\mathbb{E}\!\left[
\left(
\mathbf{x}_t
-
\widehat{\mathbf{x}}_{t\mid t-1}
-
\mathbf{K}_t
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right)\!\cdot\!
\left(
\mathbf{x}_t
-
\widehat{\mathbf{x}}_{t\mid t-1}
-
\mathbf{K}_t
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right)^{\prime}
\right]
\\[4pt]
&=
\mathbb{E}\!\left[
\left(
\mathbf{x}_t
-
\widehat{\mathbf{x}}_{t\mid t-1}
-
\mathbf{K}_t
\left(
\mathbf{H}_t\mathbf{x}_t
+
\mathbf{U}_t\mathbf{u}_t
-
\mathbf{H}_t\widehat{\mathbf{x}}_{t\mid t-1}
\right)
\right)\!\cdot\!
\left(
\mathbf{x}_t
-
\widehat{\mathbf{x}}_{t\mid t-1}
-
\mathbf{K}_t
\left(
\mathbf{H}_t\mathbf{x}_t
+
\mathbf{U}_t\mathbf{u}_t
-
\mathbf{H}_t\widehat{\mathbf{x}}_{t\mid t-1}
\right)
\right)^{\prime}
\right]
\\[4pt]
&=
\mathbb{E}\!\left[
\left(
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\left(
\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t-1}
\right)
-
\mathbf{K}_t\mathbf{U}_t\mathbf{u}_t
\right)
\!\cdot\!
\left(
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\left(
\mathbf{x}_t-\widehat{\mathbf{x}}_{t\mid t-1}
\right)
-
\mathbf{K}_t\mathbf{U}_t\mathbf{u}_t
\right)^{\prime}
\right]
\\[4pt]
&=
\mathbb{E}\!\left[
\left(
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbf{e}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{U}_t\mathbf{u}_t
\right)
\left(
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbf{e}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{U}_t\mathbf{u}_t
\right)^{\prime}
\right]
\\[4pt]
&=
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbb{E}\!\left[
\mathbf{e}_{t\mid t-1}\mathbf{e}_{t\mid t-1}^{\prime}
\right]
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)^{\prime}
\\[-2pt]
&\quad
-
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbb{E}\!\left[
\mathbf{e}_{t\mid t-1}\mathbf{u}_t^{\prime}
\right]
\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}
\\[-2pt]
&\quad
-
\mathbf{K}_t\mathbf{U}_t
\mathbb{E}\!\left[
\mathbf{u}_t\mathbf{e}_{t\mid t-1}^{\prime}
\right]
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)^{\prime}
\\[-2pt]
&\quad
+
\mathbf{K}_t\mathbf{U}_t
\mathbb{E}\!\left[
\mathbf{u}_t\mathbf{u}_t^{\prime}
\right]
\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}.
\end{aligned}
$$

And because we know that:

$$
\mathbb{E}\!\left[
\mathbf{e}_{t\mid t-1}\mathbf{u}_t^{\prime}
\right]
=
\mathbf{0},
\qquad
\mathbb{E}\!\left[
\mathbf{u}_t\mathbf{e}_{t\mid t-1}^{\prime}
\right]
=
\mathbf{0},
$$

we can continue as follows:

$$
\begin{aligned}
\mathbf{P}_{t\mid t}
&=
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbf{P}_{t\mid t-1}
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)^{\prime}
+
\mathbf{K}_t\mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\left(\mathbf{I}-\mathbf{K}_t\mathbf{H}_t\right)
\mathbf{P}_{t\mid t-1}
\left(\mathbf{I}-\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}\right)
+
\mathbf{K}_t\mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
\left(\mathbf{I}-\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}\right)
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
\left(\mathbf{I}-\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}\right)
+
\mathbf{K}_t\mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
+
\mathbf{K}_t\mathbf{H}_t
\mathbf{P}_{t\mid t-1}
\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
+
\mathbf{K}_t\mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
-
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
+
\mathbf{K}_t
\left(
\mathbf{H}_t\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}
+
\mathbf{U}_t\mathbf{R}_t\mathbf{U}_t^{\prime}
\right)
\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
-
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
+
\mathbf{K}_t\mathbf{C}_{t\mid t-1}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
-
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
+
\left(
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{C}_{t\mid t-1}^{-1}
\right)
\mathbf{C}_{t\mid t-1}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
-
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
+
\mathbf{P}_{t\mid t-1}\mathbf{H}_t^{\prime}\mathbf{K}_t^{\prime}
\\[4pt]
&=
\mathbf{P}_{t\mid t-1}
-
\mathbf{K}_t\mathbf{H}_t\mathbf{P}_{t\mid t-1}
\\[4pt]
&=
\left(
\mathbf{I}-\mathbf{K}_t\mathbf{H}_t
\right)
\mathbf{P}_{t\mid t-1}.
\end{aligned}
$$

## 3. Parameter Estimation with MLE

The parameter set

$$
\boldsymbol{\theta}
=
\left\{
\mathbf{A}_t,
\mathbf{W}_t,
\mathbf{H}_t,
\mathbf{U}_t
\right\}
$$

can be estimated using Maximum Likelihood Estimation by finding the parameter values under which the observed sequence $\mathbf{z}_1,\ldots,\mathbf{z}_N$ is as unsurprising as possible. This means that the one-step-ahead conditional probabilities assigned by the model to the actually observed values $\mathbf{z}_t$ should be jointly as large as possible:

$$
\widehat{\boldsymbol{\theta}}
=
\underset{\boldsymbol{\theta}}{\arg\max}
\;
p\!\left(
\mathbf{z}_{1:N}
\mid
\boldsymbol{\theta}
\right)
=
\underset{\boldsymbol{\theta}}{\arg\max}
\;
\prod_{t=1}^{N}
p\!\left(
\mathbf{z}_t
\mid
\mathbf{z}_{1:t-1},
\boldsymbol{\theta}
\right).
$$

As established in the previous section, the Kalman Filter provides the following one-step-ahead conditional mean and covariance matrix for the measurement variable $\mathbf{z}_t$:

$$
\widehat{\mathbf{z}}_{t\mid t-1}
=
\mathbb{E}\!\left[
\mathbf{z}_t
\mid
\mathbf{z}_{1:t-1}
\right]
=
\mathbb{E}\!\left[
\mathbf{H}_t\mathbf{x}_t
+
\mathbf{U}_t\mathbf{u}_t
\mid
\mathbf{z}_{1:t-1}
\right]
=
\mathbf{H}_t
\widehat{\mathbf{x}}_{t\mid t-1},
$$

$$
\mathbf{C}_{t\mid t-1}
=
\mathbb{E}\!\left[
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mid
\mathbf{z}_{1:t-1}
\right]
=
\mathbf{H}_t
\mathbf{P}_{t\mid t-1}
\mathbf{H}_t^{\prime}
+
\mathbf{U}_t
\mathbf{R}_t
\mathbf{U}_t^{\prime},
$$

which fully characterize the one-step-ahead Gaussian predictive distribution of $\mathbf{z}_t$, conditional on the previous observations $\mathbf{z}_{1:t-1}$ and the parameter set $\boldsymbol{\theta}$:

$$
\mathbf{z}_t
\mid
\mathbf{z}_{1:t-1},
\boldsymbol{\theta}
\sim
\mathcal{N}\!\left(
\widehat{\mathbf{z}}_{t\mid t-1},
\mathbf{C}_{t\mid t-1}
\right).
$$

Then, the corresponding conditional probability density function evaluated at the observed value $\mathbf{z}_t$ is:

$$
p\!\left(
\mathbf{z}_t
\mid
\mathbf{z}_{1:t-1},
\boldsymbol{\theta}
\right)
=
\frac{1}{
\sqrt{
(2\pi)^{n_z}
\det\!\left(\mathbf{C}_{t\mid t-1}\right)
}
}
\exp\!\left[
-\frac{1}{2}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mathbf{C}_{t\mid t-1}^{-1}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right].
$$

where $n_z$ is the dimension of each observation vector $\mathbf{z}_t$, whereas $N$ is the number of time steps in the complete observed sequence.

Substituting this conditional Normal density into the likelihood of the complete observed sequence gives:

$$
\begin{aligned}
\mathcal{L}_{1:N}\!\left(\boldsymbol{\theta}\right)
&=
\prod_{t=1}^{N}
p\!\left(
\mathbf{z}_t
\mid
\mathbf{z}_{1:t-1},
\boldsymbol{\theta}
\right)
\\[4pt]
&=
\prod_{t=1}^{N}
\left[
\frac{1}{
\sqrt{
(2\pi)^{n_z}
\det\!\left(\mathbf{C}_{t\mid t-1}\right)
}
}
\exp\!\left[
-\frac{1}{2}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mathbf{C}_{t\mid t-1}^{-1}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right]
\right].
\end{aligned}
$$

For optimization, the likelihood can be simplified by taking its logarithm, which transforms the product over time into a sum:

$$
\begin{aligned}
\ln\mathcal{L}_{1:N}\!\left(\boldsymbol{\theta}\right)
&=
\sum_{t=1}^{N}
\ln\!\left[
\frac{1}{
\sqrt{
(2\pi)^{n_z}
\det\!\left(\mathbf{C}_{t\mid t-1}\right)
}
}
\exp\!\left[
-\frac{1}{2}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mathbf{C}_{t\mid t-1}^{-1}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right]
\right]
\\[4pt]
&=
-\frac{1}{2}
\sum_{t=1}^{N}
\left[
n_z\ln(2\pi)
+
\ln\det\!\left(\mathbf{C}_{t\mid t-1}\right)
+
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mathbf{C}_{t\mid t-1}^{-1}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
\right].
\end{aligned}
$$

This expression can be simplified further. Since the term $n_z\ln(2\pi)$ is constant with respect to $\boldsymbol{\theta}$, and the common factor $-1/2$ does not affect which parameter values maximize the function, we can omit the constant term and change the sign. Then, maximizing the log-likelihood is equivalent to minimizing:

$$
\begin{aligned}
\widehat{\boldsymbol{\theta}}
&=
\underset{\boldsymbol{\theta}}{\arg\min}
\;
L_{1:N}\!\left(\boldsymbol{\theta}\right)
\\[4pt]
&=
\underset{\boldsymbol{\theta}}{\arg\min}
\;
\sum_{t=1}^{N}
\left[
\underbrace{
\ln\det\!\left(\mathbf{C}_{t\mid t-1}\right)
}_{\substack{
\text{Prevention from making}\\
\text{every observation unsurprising}
}}
+
\underbrace{
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)^{\prime}
\mathbf{C}_{t\mid t-1}^{-1}
\left(
\mathbf{z}_t-\widehat{\mathbf{z}}_{t\mid t-1}
\right)
}_{\substack{
\text{Penalization of}\\
\text{prediction error}
}}
\right].
\end{aligned}
$$

When $z_t$ is a scalar variable, the determinant reduces to the scalar conditional variance $C_{t\mid t-1}$, while the inverse covariance matrix reduces to $1/C_{t\mid t-1}$. Therefore, the objective simplifies to:

$$
L_{1:N}(\theta)
=
\sum_{t=1}^{N}
\left[
\ln\!\left(C_{t\mid t-1}\right)
+
\frac{
\left(
z_t-\widehat{z}_{t\mid t-1}
\right)^2
}{
C_{t\mid t-1}
}
\right].
$$
